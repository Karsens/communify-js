const serverAddr = "https://communify.leckrapi.xyz";
const localAddr = "http://192.168.178.221:4003";
const devLocal = true;

const Constants = {
  SERVER_ADDR: __DEV__ && devLocal ? localAddr : serverAddr,
  VERSION: "3.0.1",
  FRANCHISE: {
    /**
     * only inside apps when no subdomain is given, this is used
     */
    slug: "tribes",
  },
};

export default Constants;
