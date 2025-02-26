import { useParams, useNavigate } from 'react-router-dom';

function CountryPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  return (
    <div className="country-container">
      <div className="country-card">
        <h1 className="country-name">{name}</h1>
        <div className="country-info">
          <p>
            🌍 Selected Country: <strong>{name}</strong>
          </p>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default CountryPage;
