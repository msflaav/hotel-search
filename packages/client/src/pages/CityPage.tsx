import { useParams, useNavigate } from 'react-router-dom';

function CityPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  return (
    <div className="city-container">
      <div className="city-card">
        <h1 className="city-name">{name}</h1>
        <p className="city-info">
          🌍 <strong>City:</strong> {name}
        </p>
        <p className="city-info">
          🏙️ <strong>Region:</strong> Coming Soon...
        </p>
        <p className="city-info">
          ✈️ <strong>Popular Attractions:</strong> Coming Soon...
        </p>

        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default CityPage;
