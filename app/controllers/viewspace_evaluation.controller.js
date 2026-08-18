const crypto = require("crypto");

const db = require("../models").db;
const ViewspaceEvaluation = db.viewspace_evaluation;

const EVALUATION_DAYS = 30;

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

exports.activate = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    const activatedAt = new Date();
    const expiresAt = new Date(
      activatedAt.getTime() +
      EVALUATION_DAYS * 24 * 60 * 60 * 1000
    );

    const origin = req.get("origin") || null;

    await ViewspaceEvaluation.create({
      tokenHash,
      activatedAt,
      expiresAt,
      lastSeenAt: activatedAt,
      origin
    });

    res.status(201).send({
      token,
      expires: expiresAt
    });

  } catch (err) {
    console.error("Viewspace evaluation activation failed:", err);

    res.status(500).send({
      message: "Unable to activate Viewspace evaluation."
    });
  }
};

exports.validate = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(400).send({
        message: "Evaluation token is required."
      });
    }

    const tokenHash = hashToken(token);

    const evaluation =
      await ViewspaceEvaluation.findOne({
        where: {
          tokenHash
        }
      });

    if (!evaluation) {
      return res.status(404).send({
        valid: false,
        reason: "INVALID_TOKEN"
      });
    }

    const now = new Date();
    const valid = now < evaluation.expiresAt;

    await evaluation.update({
      lastSeenAt: now
    });

    res.send({
      valid,
      expires: evaluation.expiresAt,
      reason: valid ? null : "EVALUATION_EXPIRED"
    });

  } catch (err) {
    console.error("Viewspace evaluation validation failed:", err);

    res.status(500).send({
      message: "Unable to validate Viewspace evaluation."
    });
  }
};
exports.register = async (req, res) => {
    try {
      const company = req.body.company;
      const email = req.body.email;
  
      if (!company || !email) {
        return res.status(400).send({
          message: "Company name and email are required."
        });
      }
  
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(token);
  
      const activatedAt = new Date();
      const expiresAt = new Date(
        activatedAt.getTime() +
        EVALUATION_DAYS * 24 * 60 * 60 * 1000
      );
  
      const origin = req.get("origin") || null;
  
      await ViewspaceEvaluation.create({
        tokenHash,
        company,
        email,
        activatedAt,
        expiresAt,
        lastSeenAt: activatedAt,
        origin
      });
  
      res.status(201).send({
        token,
        expires: expiresAt
      });
  
    } catch (err) {
      console.error(
        "Viewspace evaluation registration failed:",
        err
      );
  
      res.status(500).send({
        message: "Unable to register Viewspace evaluation."
      });
    }
  };