

import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="registration-success-container">
      <div className="success-content">
        <h2>Qeydiyyat uğurla tamamlandı!</h2>
        <p>Hesabınız yaradıldı. Daxil olmaq üçün e-poçt ünvanınıza göndərilən təsdiq linkini yoxlayın.</p>
        
        <button onClick={goToLogin} className="login-button">
          Daxil ol
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;