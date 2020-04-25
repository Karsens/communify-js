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
  dialect: "sqlite",
  storage: "database/db3.sqlite",
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
  },
  {
    sequelize,
    modelName: "franchise",
  }
);

//community belongs to franchise
class Community extends Model {}

Community.init(
  {
    fid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    bio: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "community",
  }
);
Community.belongsTo(Franchise, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Franchise.hasMany(Community, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsTo(Community, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Community.hasMany(User, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.belongsTo(Franchise, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Franchise.hasMany(User, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

class CommunitySub extends Model {}

CommunitySub.init(
  {
    uid: DataTypes.INTEGER,
    coid: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "communitysub",
  }
);

CommunitySub.belongsTo(User, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(CommunitySub, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CommunitySub.belongsTo(Community, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Community.hasMany(CommunitySub, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//chat belongs to channel, sub belongs to channel. channel belongs to community

class Channel extends Model {}

Channel.init(
  {
    coid: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "channel",
  }
);

Channel.belongsTo(Community, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Community.hasMany(Channel, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

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
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Channel.hasMany(ChannelSub, {
  foreignKey: "cid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ChannelSub.belongsTo(User, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(ChannelSub, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
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
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Chat, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Chat.belongsTo(Channel, {
  foreignKey: "cid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Channel.hasMany(Chat, {
  foreignKey: "cid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Comments belong to posts
class Post extends Model {}

Post.init(
  {
    uid: DataTypes.INTEGER,
    fid: DataTypes.INTEGER,
    post: DataTypes.STRING,
    image: DataTypes.STRING,
    numComments: { type: DataTypes.NUMBER, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "post",
  }
);

Post.belongsTo(Franchise, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Franchise.hasMany(Post, {
  foreignKey: "fid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Post, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
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
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(Comment, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "pid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Post.hasMany(Comment, {
  foreignKey: "pid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
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

Group.belongsTo(Community, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Community.hasMany(Group, {
  foreignKey: "coid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

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
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(GroupSub, {
  foreignKey: "uid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

GroupSub.belongsTo(Group, {
  foreignKey: "gid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Group.hasMany(GroupSub, {
  foreignKey: "gid",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

try {
  sequelize.sync({ alter: true });
} catch (e) {
  console.log("e", e);
}
server.use(body_parser.json({ limit: "10mb", extended: true }));
server.use(body_parser.urlencoded({ limit: "10mb", extended: true }));

server.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

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

const port = process.env.PORT || 4001;

server.get("/", (req, res) => {
  res.send(listEndpoints(server));
});

http
  .createServer(server)
  .listen(port, () => console.log(`Server listening on localhost ${port}`));
