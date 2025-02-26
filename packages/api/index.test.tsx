import { spawn, ChildProcess } from 'child_process';

let server: ChildProcess;

beforeAll((done) => {
  server = spawn('node', ['packages/api/index.js']);
  setTimeout(done, 3000);
});

afterEach(() => {
  server.kill();
  server = spawn('node', ['packages/api/index.js']);
});

test('GET /search should return 400 when query is missing', async () => {
  const response = await fetch('http://localhost:3001/search');
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toBe('Query parameter is required');
});

test('GET /search with a valid query should return hotels, cities, or countries', async () => {
  const response = await fetch('http://localhost:3001/search?query=london');
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data).toHaveProperty('hotels');
  expect(data).toHaveProperty('cities');
  expect(data).toHaveProperty('countries');

  data.hotels.forEach((hotel: { hotel_name: string; city: string }) => {
    expect(
      hotel.hotel_name.toLowerCase().includes('london') ||
        hotel.city.toLowerCase().includes('london')
    ).toBe(true);
  });
  expect(
    data.cities.some(
      (city: { name: string }) => city.name.toLowerCase() === 'london'
    )
  ).toBe(true);

  expect(data.countries).toEqual([]);
});

test('GET /search with invalid characters should return 400', async () => {
  const response = await fetch('http://localhost:3001/search?query=123!@#');
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toBe('Invalid query. Only letters and spaces are allowed');
});

test('GET /search with a non-existent term should return 404', async () => {
  const response = await fetch('http://localhost:3001/search?query=xyzxyzxyz');
  const data = await response.json();

  expect(response.status).toBe(404);
  expect(data.error).toBe('No results found');
});

test('GET /search should be case-insensitive', async () => {
  const responseLowercase = await fetch(
    'http://localhost:3001/search?query=london'
  );
  const responseUppercase = await fetch(
    'http://localhost:3001/search?query=LONDON'
  );

  const dataLower = await responseLowercase.json();
  const dataUpper = await responseUppercase.json();

  expect(responseLowercase.status).toBe(200);
  expect(responseUppercase.status).toBe(200);
  expect(dataLower).toEqual(dataUpper);
});

test('GET /search should return 400 if query is too long', async () => {
  const longQuery = 'a'.repeat(51); // Exceeds 50-character limit
  const response = await fetch(
    `http://localhost:3001/search?query=${longQuery}`
  );
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toBe('Query is too long. Max length is 50 characters');
});

test('GET /search should return 404 for valid but unmatched query', async () => {
  const response = await fetch(
    'http://localhost:3001/search?query=abcdefghijk'
  );
  const data = await response.json();

  expect(response.status).toBe(404);
  expect(data.error).toBe('No results found');
});

test('GET /search should reject special characters', async () => {
  const response = await fetch('http://localhost:3001/search?query=!@#$%^&*()');
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toBe('Invalid query. Only letters and spaces are allowed');
});

test('GET /search should return 429 when exceeding rate limit', async () => {
  const requests = [];
  const maxRequests = 200;
  const extraRequest = 1;

  for (let i = 0; i < maxRequests + extraRequest; i++) {
    requests.push(fetch('http://localhost:3001/search?query=test'));
  }

  const responses = await Promise.all(requests);

  expect(responses[maxRequests].status).toBe(429);
});
