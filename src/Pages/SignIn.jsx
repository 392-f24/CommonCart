import { signInWithGoogle, useDbUpdate } from '../utilities/firebase';
import { OrangeButton } from '../Components/Buttons';
import "./SignIn.css"

const SignIn = () => {
    const [update] = useDbUpdate('/users');

    const CreateNewUser = async() => {
        try {
            const result = await signInWithGoogle();
            const userID = (result.user).uid;

            const userData = {
                [userID]:
                {
                    displayName: result.user.displayName,
                    email: result.user.email
                }
            };
            await(update(userData));
            console.log('Form submitted:',);
      } catch (error) {
            console.error("Error saving data:", error);
      };
    }

    return (
        <div className="sign-in-page">
            <div className="title-container">
                <i className="cart-icon-large bi bi-cart-fill"></i>
                <div className="title">
                    <span className="common">Common</span>
                    <span className="cart">Cart</span>
                </div>
            </div>
            <OrangeButton onClick={() => CreateNewUser()} title={"Sign In"}/>
        </div>

    );
}

export default SignIn;