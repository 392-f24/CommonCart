import { useNavigate } from 'react-router-dom';
import { OrangeButton } from "../Components/Buttons"

const GoShoppingPage = () => {
    const navigate = useNavigate();
    const DirectCheckList = () => {
        navigate('/'); // TODO: navigate to the checklist page, pass data needed
      };
      return(
        <OrangeButton title={"Go shopping"} onClick={DirectCheckList}/>
      );
    
}
export default GoShoppingPage