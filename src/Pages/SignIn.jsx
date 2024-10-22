import { Button } from 'react-bootstrap';
import { signInWithGoogle, signOut, useDbUpdate } from '../utilities/firebase';

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

    return <Button onClick={() => CreateNewUser()}>Sing In</Button>;
}
export const SignOut = () =>(
    <Button onClick={signOut}>Sing Out</Button>
);
export default SignIn;