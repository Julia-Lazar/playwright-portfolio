import { apiTest as test, expect, newBooking, getAuthHeaders } from '../../fixtures/fixtures';

test('booking CRUD chain @smoke', async ({ request, booking }) => {
  // create: done by the `booking` fixture, which also checks the 200 status
  const headers = await getAuthHeaders(request);

  await test.step('read', async () => {
    const res = await request.get(`/booking/${booking}`);
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toMatchObject(newBooking);   // what we created is what we get back
  });

  await test.step('update (PATCH)', async () => {
    const newPrice = newBooking.totalprice + 1;   // always differs, so the PATCH really changes something
    const res = await request.patch(`/booking/${booking}`, { headers, data: { totalprice: newPrice } });
    expect(res.status()).toBe(200);
    expect((await res.json()).totalprice).toBe(newPrice);
  });

  await test.step('delete', async () => {
    const res = await request.delete(`/booking/${booking}`, { headers });
    expect(res.status()).toBe(201);               // this API's quirk: 201, not 204
    expect((await request.get(`/booking/${booking}`)).status()).toBe(404);
  });
});

test('updating without a token is forbidden', async ({ request, booking }) => {
  // always differs from the original, so the "unchanged" check below is meaningful
  const res = await request.patch(`/booking/${booking}`, { data: { totalprice: newBooking.totalprice + 1 } });
  expect(res.status()).toBe(403);

  // 403 alone is not enough: the booking must also stay unchanged
  const after = await request.get(`/booking/${booking}`);
  expect((await after.json()).totalprice).toBe(newBooking.totalprice);
});
