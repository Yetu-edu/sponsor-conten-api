import { z, ZodError } from "zod";
import { Response, Request } from "express";
import { makeSubscriptionService } from "@/interfaces/factory/subscriptionFactory";

const createSubscriptionSchema = z.object({
  plan: z.enum(["basic", "premium", "enterprise"]),
});

export class SubscriptionController {
  async create(request: Request, response: Response) {
    try {
      const { plan } = createSubscriptionSchema.parse(request.body);
      const user_id = request.user.sub;

      const service = makeSubscriptionService();

      const subscription = await service.execute({
        user_id,
        plan,
      });

      return response.status(201).json(subscription);
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).json({ message: "Validation failed", issues: error.issues });
      }

      return response.status(500).json({ message: "Internal server error" });
    }
  }
}