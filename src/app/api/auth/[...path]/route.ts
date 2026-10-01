import { getAuth } from "@/lib/auth";
import { isAllowedOfferEmail } from "@/lib/offer-access";

export const dynamic = "force-dynamic";

type AuthRouteContext = {
  params: Promise<{ path: string[] }>;
};

async function rejectUnapprovedOtpRequest(
  request: Request,
  context: AuthRouteContext,
) {
  const { path } = await context.params;

  if (path.join("/") !== "email-otp/send-verification-otp") return null;

  const body = (await request.clone().json().catch(() => null)) as {
    email?: unknown;
  } | null;
  const email = typeof body?.email === "string" ? body.email : "";

  if (await isAllowedOfferEmail(email)) return null;

  return Response.json(
    {
      code: "EMAIL_NOT_ALLOWED",
      message: "Ova e-mail adresa nema pristup Concept One ponudama.",
    },
    { status: 403 },
  );
}

export async function GET(request: Request, context: AuthRouteContext) {
  return getAuth().handler().GET(request, context);
}

export async function POST(request: Request, context: AuthRouteContext) {
  const rejectedResponse = await rejectUnapprovedOtpRequest(request, context);
  if (rejectedResponse) return rejectedResponse;

  return getAuth().handler().POST(request, context);
}

export async function PUT(request: Request, context: AuthRouteContext) {
  return getAuth().handler().PUT(request, context);
}

export async function PATCH(request: Request, context: AuthRouteContext) {
  return getAuth().handler().PATCH(request, context);
}

export async function DELETE(request: Request, context: AuthRouteContext) {
  return getAuth().handler().DELETE(request, context);
}
