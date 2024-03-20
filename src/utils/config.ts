const createResponse = (
  statusCode: number,
  message: string,
  content: any,
): any => {
  return { statusCode, message, content, dateTime: new Date() };
};

export { createResponse };
