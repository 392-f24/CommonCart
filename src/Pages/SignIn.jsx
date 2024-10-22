import { Button } from 'react-bootstrap';
import { signInWithGoogle, signOut, useDbAdd, useDbData, useAuthState } from '../utilities/firebase';
import { useEffect } from 'react';


const CreateNewUser = async(add) => {


    try {

        const result = await signInWithGoogle();
        const userID = (result.user).uid;

        const userData = {
            displayName: result.user.displayName,
            email: result.user.email,
        };
        await add(userData,userID);
        console.log('Form submitted:',);
      } catch (error) {
        console.error("Error saving data:", error);
      };
}

const SignIn = () => {
    const [add] = useDbAdd('/users');

    return <Button onClick={() => CreateNewUser(add)}>Sing In</Button>;
}
export const SignOut = () =>(
    <Button onClick={signOut}>Sing Out</Button>
);
export default SignIn;