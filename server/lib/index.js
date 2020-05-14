const express = require("express");
const server = express();
const body_parser = require("body-parser");
const sgMail = require("@sendgrid/mail");
var http = require("http");
const listEndpoints = require("express-list-endpoints");

const { Sequelize, Model, DataTypes, Op } = require("sequelize");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var cors = require("cors");

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialectOptions: {
    host: process.env.DB_HOST,
    port: "3306",
  },
  logging: null,
});

class User extends Model {}

User.init(
  {
    loginToken: DataTypes.STRING,
    activationToken: DataTypes.STRING,
    forgotPasswordToken: DataTypes.STRING,
    activated: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,

    bio: DataTypes.STRING,
    password: DataTypes.STRING,
    onlineAt: DataTypes.INTEGER,
    /**
     * current community that is shown
     */
    fid: DataTypes.INTEGER,
    coid: DataTypes.INTEGER,
  },
  { sequelize, modelName: "user" }
);

class Franchise extends Model {}

Franchise.init(
  {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    bio: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "franchise",
  }
);

class Tribe extends Model {}

Tribe.init(
  {
    fid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    tagline: DataTypes.STRING,
    bio: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "tribe",
  }
);

Tribe.belongsTo(Franchise, {
  foreignKey: "fid",
});
Franchise.hasMany(Tribe, {
  foreignKey: "fid",
});

//chat belongs to channel, sub belongs to channel. channel belongs to community

class Channel extends Model {}

Channel.init(
  {
    fid: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "channel",
  }
);

class ChannelSub extends Model {}

ChannelSub.init(
  {
    uid: DataTypes.INTEGER,
    cid: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "channelsub",
  }
);
ChannelSub.belongsTo(Channel, {
  foreignKey: "cid",
});
Channel.hasMany(ChannelSub, {
  foreignKey: "cid",
});

ChannelSub.belongsTo(User, {
  foreignKey: "uid",
});
User.hasMany(ChannelSub, {
  foreignKey: "uid",
});

class Chat extends Model {}

Chat.init(
  {
    uid: DataTypes.INTEGER,
    cid: DataTypes.INTEGER,
    message: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "chat",
  }
);
Chat.belongsTo(User, {
  foreignKey: "uid",
});
User.hasMany(Chat, {
  foreignKey: "uid",
});

Chat.belongsTo(Channel, {
  foreignKey: "cid",
});
Channel.hasMany(Chat, {
  foreignKey: "cid",
});

// Comments belong to posts
class Post extends Model {}

Post.init(
  {
    uid: DataTypes.INTEGER,
    fid: DataTypes.INTEGER,
    post: DataTypes.STRING,
    image: DataTypes.STRING,
    numComments: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "post",
  }
);

Post.belongsTo(User, {
  foreignKey: "uid",
});
User.hasMany(Post, {
  foreignKey: "uid",
});

class Comment extends Model {}

Comment.init(
  {
    uid: DataTypes.INTEGER,
    pid: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "comment",
  }
);

Comment.belongsTo(User, {
  foreignKey: "uid",
});
User.hasMany(Comment, {
  foreignKey: "uid",
});

Comment.belongsTo(Post, {
  foreignKey: "pid",
});
Post.hasMany(Comment, {
  foreignKey: "pid",
});

/**
 * companies, teams
 */
class Group extends Model {}

Group.init(
  {
    coid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "group",
  }
);

class GroupSub extends Model {}

GroupSub.init(
  {
    uid: DataTypes.INTEGER,
    gid: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "groupsub",
  }
);

GroupSub.belongsTo(User, {
  foreignKey: "uid",
});
User.hasMany(GroupSub, {
  foreignKey: "uid",
});

GroupSub.belongsTo(Group, {
  foreignKey: "gid",
});
Group.hasMany(GroupSub, {
  foreignKey: "gid",
});

class Folder extends Model {}

Folder.init(
  {
    fid: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    file: DataTypes.STRING,
    /**
     * file can be image and then it needs a thumbnail
     */
    thumbnail: DataTypes.STRING,
    type: DataTypes.STRING,
    /**
     * type can be text and then it needs a text, or if type is youtube, then text is the youtube url
     */
    text: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "folder",
  }
);

try {
  sequelize
    .sync({ alter: true }) //{ alter: true }
    .then(() => {
      console.log("synced");
    })
    .catch((e) => console.log(e));
} catch (e) {
  console.log("e", e);
}
server.use(body_parser.json({ limit: "10mb", extended: true }));
server.use(body_parser.urlencoded({ limit: "10mb", extended: true }));

server.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
    optionsSuccessStatus: 200,
  })
);

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

server.use("/images", express.static("images"));
server.use("/uploads", express.static("uploads"));

/** ENDPOINTS  */

server.get("/profile", (req, res) =>
  require("./profile").profile(req, res, User)
);

server.get("/members", (req, res) =>
  require("./members").members(req, res, User)
);

server.get("/me", (req, res) => require("./me").me(req, res, User));

server.post("/forgotPassword", (req, res) =>
  require("./forgotPassword").forgotPassword(req, res, User)
);

server.post("/forgotPassword2", (req, res) =>
  require("./forgotPassword").forgotPassword2(req, res, User)
);

server.post("/activate", (req, res) =>
  require("./activate").activate(req, res, User)
);

server.post("/updateProfile", (req, res) =>
  require("./updateProfile").update(req, res, User)
);

server.post("/updateFranchise", (req, res) =>
  require("./updateFranchise").update(req, res, User, Franchise)
);

server.post("/changePassword", (req, res) =>
  require("./changePassword").changePassword(req, res, User)
);

server.post("/login", (req, res) => require("./login").login(req, res, User));

server.post("/signup", (req, res) =>
  require("./signup").signup(req, res, User, Franchise)
);

/**
 * Franchises
 */

server.post("/signupFranchise", (req, res) =>
  require("./signupFranchise").signupFranchise(req, res, User, Franchise)
);

server.get("/franchises", (req, res) =>
  require("./franchises").franchises(req, res, User, Franchise)
);

server.get("/franchise", (req, res) =>
  require("./franchise").franchise(req, res, User, Franchise)
);

server.post("/createFranchise", (req, res) =>
  require("./adminFranchise").createFranchise(req, res, User, Franchise)
);
server.post("/deleteFranchise", (req, res) =>
  require("./adminFranchise").deleteFranchise(req, res, User, Franchise)
);

/**
 * Posts
 */
server.get("/posts", (req, res) =>
  require("./posts").posts(req, res, User, Franchise, Post)
);

server.get("/getPost", (req, res) =>
  require("./getPost").getPost(req, res, User, Franchise, Post, Comment)
);

server.post("/comment", (req, res) =>
  require("./comment").comment(req, res, User, Franchise, Post, Comment)
);

server.post("/post", (req, res) =>
  require("./post").post(req, res, User, Franchise, Post)
);

server.post("/deletePost", (req, res) =>
  require("./deletePost").deletePost(req, res, User, Franchise, Post, Comment)
);

/**
 * folders
 */

server.get("/folder", (req, res) =>
  require("./folder").folder(req, res, User, Franchise, Folder)
);
server.post("/createFolderItem", (req, res) =>
  require("./createFolderItem").createFolderItem(
    req,
    res,
    User,
    Franchise,
    Folder
  )
);

const port = process.env.PORT || 4003;

server.get("/", (req, res) => {
  res.send(listEndpoints(server));
});

http
  .createServer(server)
  .listen(port, () => console.log(`Server listening on localhost ${port}`));
