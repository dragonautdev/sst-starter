import ReactMarkdown from 'react-markdown';

const h1 = ({ children }: { children?: React.ReactNode }) => {
  return <h1 className='text-3xl font-bold'>{children}</h1>;
};

const h2 = ({ children }: { children?: React.ReactNode }) => {
  return <h2 className='text-2xl font-bold'>{children}</h2>;
};

const h3 = ({ children }: { children?: React.ReactNode }) => {
  return <h3 className='text-xl font-bold'>{children}</h3>;
};

const h4 = ({ children }: { children?: React.ReactNode }) => {
  return <h4 className='text-lg font-bold'>{children}</h4>;
};

const h5 = ({ children }: { children?: React.ReactNode }) => {
  return <h5 className='text-base font-bold'>{children}</h5>;
};

const h6 = ({ children }: { children?: React.ReactNode }) => {
  return <h6 className='text-sm font-bold'>{children}</h6>;
};

const p = ({ children }: { children?: React.ReactNode }) => {
  return <p className='text-sm text-gray-800 leading-relaxed mb-4 text-balance text-wrap'>{children}</p>;
};

const a = ({ children, href }: { children?: React.ReactNode, href?: string }) => {
  return <a href={href} target='_blank' rel='noopener noreferrer' className='text-primary underline'>{children}</a>;
};

const ul = ({ children }: { children?: React.ReactNode }) => {
  return <ul className='list-disc list-inside text-balance text-wrap'>{children}</ul>;
};

const ol = ({ children }: { children?: React.ReactNode }) => {
  return <ol className='list-decimal list-inside'>{children}</ol>;
};

const li = ({ children }: { children?: React.ReactNode }) => {
  return <li className=' text-sm text-gray-800 leading-relaxed mb-2'>{children}</li>;
};

const blockquote = ({ children }: { children?: React.ReactNode }) => {
  return <blockquote className='text-gray-800 leading-relaxed mb-4'>{children}</blockquote>;
};

const hr = () => {
  return <hr className='my-4 border-t border-gray-300' />;
};

export default function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={{
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    a,
    ul,
    ol,
    li,
    blockquote,
    hr,
  }} >{children}</ReactMarkdown>;
}
