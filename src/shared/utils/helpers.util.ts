export function isDevelopement(): boolean {
  return process.env.NODE_ENV?.startsWith('dev') ? true : false;
}




