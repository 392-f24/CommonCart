import { useNavigate } from 'react-router-dom';
import { OrangeButton } from "../Components/Buttons"

const GoShoppingPage = () => {
  const navigate = useNavigate();

  const destination = "Walmart";
  const cartId = "64a52be5-feee-4a6b-a468-103c3d5fd024";

  const goToCheckList = () => {
    navigate('/go-shopping/checklist', { state: { destination, cart: cartId } });
  };

  return (
    <div>
      <OrangeButton title={"Go shopping"} onClick={goToCheckList} />
    </div>
  );
}

export default GoShoppingPage;