// SPDX-License-Identifier: Apache-2.0
// Redirect host-meta requests to Bridgy Fed for fediverse integration

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = `https://fed.brid.gy/.well-known/host-meta${url.search}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: targetUrl,
    },
  });
};
