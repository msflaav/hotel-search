import { useParams, useLocation, useNavigate } from 'react-router-dom';

function HotelPage() {
  useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hotel = location.state?.hotel;

  if (!hotel) {
    return (
      <div className="hotel-container">
        <h1>Hotel Not Found</h1>
        <p>Could not load hotel details.</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="hotel-container">
      <div className="hotel-card">
        <h1 className="hotel-name">{hotel.hotel_name}</h1>
        <h3 className="hotel-chain">{`Managed by ${hotel.chain_name}`}</h3>

        <div className="hotel-info">
          <p>
            <strong>📍Address:</strong> {hotel.addressline1}
          </p>
          <p>
            <strong>🏙️ City:</strong> {hotel.city}
          </p>
          <p>
            <strong>🌆 State:</strong>
            {hotel.state !== '' ? hotel.state : 'N/A'}
          </p>
          <p>
            <strong>🌍 Country:</strong>
            {hotel.country}
          </p>
          <p>
            <strong>🗺️  Country Code:</strong> {hotel.countryisocode}
          </p>
          <p>
            <strong>📮 Zip Code:</strong>
            {hotel.zipcode !== '' ? hotel.zipcode : 'N/A'}
          </p>
          <p>
            <strong>⭐ Star Rating:</strong>
            {`${hotel.star_rating} / 5`}
          </p>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default HotelPage;
