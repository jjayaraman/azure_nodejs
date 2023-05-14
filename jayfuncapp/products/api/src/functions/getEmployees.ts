import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export async function getEmployees(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: `Get employees demo , ${name}!` };
}

app.http("getEmployees", {
  methods: ["GET"],
  route: "employee/get",
  authLevel: "anonymous",
  handler: getEmployees,
});
