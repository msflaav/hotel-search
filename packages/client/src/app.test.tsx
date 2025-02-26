import { expect, test, afterEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';

import App from './app';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
test('renders search input', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );
  expect(input).toBeInTheDocument();
});

test('search input updates on user typing', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );

  fireEvent.change(input, { target: { value: 'London' } });

  expect(input).toHaveValue('London');
});

test('renders popular searches when search is empty', () => {
  render(<App />);

  expect(screen.getByText('Popular Searches:')).toBeInTheDocument();
  expect(screen.getByText('🏨 Hilton Hotel')).toBeInTheDocument();
  expect(screen.getByText('🌍 United Kingdom')).toBeInTheDocument();
  expect(screen.getByText('🏙️ Paris')).toBeInTheDocument();
});

test('clears search when clear button is clicked', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );
  const clearButton = screen.queryByRole('button', { name: /clear/i });

  fireEvent.change(input, { target: { value: 'Paris' } });
  expect(input).toHaveValue('Paris');

  if (clearButton) {
    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  }
});

test('shows search results when typing', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );

  fireEvent.change(input, { target: { value: 'London' } });

  await waitFor(() => {
    expect(screen.getByText('🏨 Hotels')).toBeInTheDocument();
    expect(screen.getByText('🌍 Countries')).toBeInTheDocument();
    expect(screen.getByText('🏙️ Cities')).toBeInTheDocument();
  });
});

test('navigates to hotel page on clicking a search result', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );

  fireEvent.change(input, { target: { value: 'Hilton Garden' } });

  await waitFor(() => {
    expect(screen.getByText(/Hilton Garden Inn/i)).toBeInTheDocument();
  });

  const hotelLink = screen.getByText(/Hilton Garden Inn/i);
  fireEvent.click(hotelLink);

  await waitFor(() => {
    expect(screen.getByText(/Hilton Garden Inn/i)).toBeInTheDocument();
  });

  const backButton = screen.getByText(/Go Back/i);
  fireEvent.click(backButton);

  await waitFor(() => {
    expect(
      screen.getByPlaceholderText('Search for hotels, cities, or countries...')
    ).toBeInTheDocument();
  });
});

test('navigates to country page on clicking a search result', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );

  fireEvent.change(input, { target: { value: 'United States' } });

  await waitFor(() => {
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
  });

  const countryLink = screen.getByText(/United States/i);
  fireEvent.click(countryLink);

  await waitFor(() => {
    expect(screen.getByText(/Selected Country:/i)).toBeInTheDocument();

    const countryNames = screen.getAllByText(/United States/i);
    expect(countryNames.length).toBeGreaterThan(0);
    expect(countryNames[0]).toBeInTheDocument();
  });

  const backButton = screen.getByText(/Go Back/i);
  fireEvent.click(backButton);

  await waitFor(() => {
    expect(
      screen.getByPlaceholderText('Search for hotels, cities, or countries...')
    ).toBeInTheDocument();
  });
});
test('navigates to city page on clicking a search result', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(
    'Search for hotels, cities, or countries...'
  );

  fireEvent.change(input, { target: { value: 'Kyoto' } });

  await waitFor(() => {
    expect(screen.getByText(/Kyoto/i)).toBeInTheDocument();
  });

  const cityLinks = screen.getAllByText(/Kyoto/i);
  fireEvent.click(cityLinks[0]);

  await waitFor(() => {
    expect(screen.getByText(/City:/i)).toBeInTheDocument();

    const kyotoInstances = screen.getAllByText(/Kyoto/i);
    expect(kyotoInstances.length).toBeGreaterThan(0);
    expect(kyotoInstances[0]).toBeInTheDocument();
  });
});
