import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { subjects } from "./subjects";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { Resource } from "sst";
import { Select } from "./select";
import { Theme } from "@openauthjs/openauth/ui/theme";
import { User } from "@sst-starter/core/user";
import { PasswordUI } from "./password"
import { bus } from "sst/aws/bus";
import { Email } from "@sst-starter/core/email";

const customTheme: Theme = {
  title: "SST Starter",

  radius: "sm",
  favicon: `${Resource.Urls.app}/favicon.ico`,
  logo: {
    light: `${Resource.Urls.app}/logo-dark.png`,
    dark: `${Resource.Urls.app}/logo-dark.png`,
  },
  primary: {
    dark: "oklch(0.97 0.01 248)",//dark: "oklch(0.457 0.24 277.023)",
    light: "oklch(0.97 0.01 248)", //'hsl(262.1 83.3% 57.8%)',
  },
  background: {
    dark: "oklch(0.21 0.04 266)",
    light: "oklch(0.21 0.04 266)",
  },
};

const app = issuer({
  subjects,
  // Remove after setting custom domain
  allow: async () => true,
  ttl: {
    access: 60 * 60 * 24, // 1 day
    refresh: 60 * 60 * 24 * 30, // 30 days
  },
  providers: {
    google: GoogleProvider({
      clientID: Resource.GoogleClientId.value,
      clientSecret: Resource.GoogleClientSecret.value,
      scopes: ["email", "profile"],
      
    }),
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code);
          await bus.publish(Resource.EmailsBus, Email.Event.ConfirmEmail, {
            email,
            code,
          });
        },
        validatePassword: (password) => {
          return undefined;
        },
        copy: {
          input_email: "Email",
        },
      })
    ),
    code: CodeProvider(
      CodeUI({
        sendCode: async (claims, code) => {
          console.log(claims, code);
          await bus.publish(Resource.EmailsBus, Email.Event.LoginCode, {
            email: claims.email,
            code,
          });
        },
      })
    ),
  },
  select: Select({
    providers: {
      google: {
        display: "Google",
      },
      password: {
        display: "Password",
      },
      code: {
        hide: true
      }
    },
  }),
  success: async (ctx, value) => {
    let user: User.Info | undefined;
    let email: string | undefined;

    if (value.provider === "code") {
      email = value.claims.email;
    } else if (value.provider === "password") {
      email = value.email;
    } else if (value.provider === "google") {
      const access = value.tokenset.access;

      // Fetch user information from Google
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access}`, // Bearer token format for Google
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user info from Google: ${response.statusText}`
        );
      }

      const userInfo = await response.json();
      email = userInfo.email;
      console.log("found email", email);
    }

    if (!email) {
      throw new Error("Invalid provider");
    }

    user = await User.fromEmail(email);
    if (!user) {
      user = await User.create({
        email: email,
      });
    }

    return ctx.subject("user", {
      userId: user.userId,
      email: user.email,
      accountId: '',
      accountName: '',
      name: user.name
    });
  },

  theme: customTheme,
});

export const handler = handle(app);
