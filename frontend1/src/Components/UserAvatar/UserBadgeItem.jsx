import { Box } from "@chakra-ui/react";
import { IoCloseSharp } from "react-icons/io5";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      paddingX={2}
      paddingY={1}
      borderRadius={"lg"}
      margin={1}
      marginBottom={2}
      fontSize={12}
      backgroundColor={"purple"}
      cursor={"pointer"}
      onClick={handleFunction}
      color={"white"}
      display={"flex"}
    >
      {user.name} <IoCloseSharp style={{paddingLeft:"1px"}}/>
    </Box>
  );
};

export default UserBadgeItem;
