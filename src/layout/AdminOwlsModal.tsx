import * as React from 'react';
import {
  Alert,
  AlertTitle,
  Code,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  UnorderedList,
} from '@chakra-ui/react';

type Props = {
  count: number;
};

const AdminOwlsModal = ({ count }: Props) => (
  <Modal onClose={() => {}} isOpen closeOnOverlayClick={false} closeOnEsc={false}>
    <ModalOverlay />
    <ModalContent>
      <ModalBody>
        <Alert status="warning" my={4}>
          <AlertTitle>
            There are {count} OWLS master nodes. The system will encounter issues if there is not exactly one master
            node
          </AlertTitle>
        </Alert>
        <Heading size="sm" mb={2}>
          To fix this issue:
        </Heading>
        <UnorderedList>
          <ListItem>
            Add <Code>simulator.master = true</Code> to the configuration of the master node
          </ListItem>
          <ListItem>
            Add <Code>simulator.master = false</Code> to the configuration(s) of any of your secondary nodes (if any)
          </ListItem>
        </UnorderedList>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default AdminOwlsModal;
