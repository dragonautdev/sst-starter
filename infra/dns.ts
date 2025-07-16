export const domain = {
  prod: "sst-starter.example.com",
}[$app.stage] || $app.stage + ".sst-starter.example.com"; 


export const dns = sst.aws.dns({
  zone: "SOME_ZONE_ID",
})