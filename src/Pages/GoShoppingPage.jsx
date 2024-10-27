import { useNavigate } from 'react-router-dom';
import { OrangeButton } from "../Components/Buttons"

const GoShoppingPage = () => {
  const navigate = useNavigate();

  const destination = ["Walmart"];
  const cartIds = ["64a52be5-feee-4a6b-a468-103c3d5fd024", "4eefcdc9-77a3-4d4c-96b9-6343bd15f9bc"];

  const goToCheckList = () => {
    navigate('/go-shopping/checklist', { state: { destination, cartIds } });
  };

  return (
    <div>
      <OrangeButton title={"Go shopping"} onClick={goToCheckList} />
    </div>
  );
}

export default GoShoppingPage;