import { z } from 'zod';

const AnalysisSchema = z.object({
  url: z
    .string()
    // .url({ message: 'The url must be valid' })
    .nonempty({ message: 'The url cannot be empty' }),
});

export type AnalysisFormData = z.infer<typeof AnalysisSchema>;
export default AnalysisSchema;
