import prisma from "../prismaClient";

export async function hasApprovedPrescription(
  userId: string,
  productId: string
) {
  const count = await prisma.prescription.count({
    where: { userId, productId, status: "APPROVED" },
  });
  return count > 0;
}
