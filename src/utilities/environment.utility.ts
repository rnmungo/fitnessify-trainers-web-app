export const isTestScope = (): boolean =>
  process.env.SCOPE ? !/[prod|PROD]/.test(process.env.SCOPE) : true;
