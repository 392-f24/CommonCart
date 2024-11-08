import { useNavigate } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import './DeleteCartModal.css'
import { useDbUpdate, useDbData, useAuthState } from "../utilities/firebase";

const DeleteCartModal = ({ closeModal, cartId, cartTitle }) => {
    const [curUser] = useAuthState();
    const [cartData, cartDataError] = useDbData(`/Cart/`);
    const [userData, userDataError] = useDbData(`/Cart/${cartId}/users/`);
    const [updataData] = useDbUpdate('/Cart/')
    const navigate = useNavigate();

    const onDelete = () => {
        const filteredUsers = userData.filter((user) => user.id !== curUser.uid);
        // last user is deleting the cart so delete the entire thing
        if (filteredUsers.length === 0) {
            updataData({[cartId]: {}});
        }
        else {
            updataData({[`${cartId}/users`]: filteredUsers});
        }
        navigate('/');
    }
  return (
    <Modal className="delete-cart-modal" show onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "1rem 1.5rem"  }}>
        <p>Are you sure you would like to delete {cartTitle}?</p>
      </Modal.Body>
      <Modal.Footer style={{padding: "0.75rem 1.5rem" }}>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => {
          onDelete();
          closeModal();
        }}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCartModal;