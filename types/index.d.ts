declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.svg';
declare module '!arraybuffer-loader!*' {
  const value: () => Promise<ArrayBuffer>;
  export default value;
}

// sorry
declare module '*';
