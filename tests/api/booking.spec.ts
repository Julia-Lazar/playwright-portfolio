import { test, expect } from '@playwright/test';

const newBooking = {
  firstname: 'Ada',
  lastname: 'Lovelace',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

test('booking CRUD chain @smoke', async ({ request }) => {
  const auth = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(auth.ok()).toBeTruthy();
  const { token } = await auth.json();
  const headers = { Cookie: `token=${token}` };

  const id = await test.step('create', async () => {
    const res = await request.post('/booking', { data: newBooking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.booking).toMatchObject(newBooking);
    return body.bookingid as number;              // dynamic ID, never hard-coded
  });

  await test.step('read', async () => {
    const res = await request.get(`/booking/${id}`);
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toMatchObject({ firstname: 'Ada', totalprice: 150 });
  });

  await test.step('update (PATCH)', async () => {
    const res = await request.patch(`/booking/${id}`, { headers, data: { totalprice: 200 } });
    expect(res.status()).toBe(200);
    expect((await res.json()).totalprice).toBe(200);
  });

  await test.step('delete', async () => {
    const res = await request.delete(`/booking/${id}`, { headers });
    expect(res.status()).toBe(201);               // this API's quirk: 201, not 204
    expect((await request.get(`/booking/${id}`)).status()).toBe(404);
  });
});

test('updating without a token is forbidden', async ({ request }) => {
  const res = await request.patch('/booking/1', { data: { totalprice: 1 } });
  expect(res.status()).toBe(403);
});