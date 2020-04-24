const serverAddr = "https://communify.leckrapi.xyz";
const localAddr = "http://192.168.178.221:4001";
const devLocal = true;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
  VERSION: "3.0.1",
  FRANCHISE: {
    id: 1,
  },
};

export default Constants;
