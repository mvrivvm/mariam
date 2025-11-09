/**
 * Simulates sending an email.
 * In a real application, this would use a service like Nodemailer (Node.js) or a third-party API.
 * For this frontend simulation, we'll log the details to the console.
 * @param to The recipient's email address.
 * @param subject The subject of the email.
 * @param body The HTML or text body of the email.
 */
export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  console.log('--- SIMULATING EMAIL ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:');
  console.log(body);
  console.log('------------------------');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real scenario, you'd have error handling here.
  // For simulation, we assume it always succeeds.
  // To test error handling, you could uncomment the following:
  // if (Math.random() > 0.8) { // 20% chance of failure
  //   throw new Error("Simulated email server error");
  // }
  
  return Promise.resolve();
};
