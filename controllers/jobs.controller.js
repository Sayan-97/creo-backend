const Job = require('../models/jobs.schema');
const Client = require('../models/client.schema');
const jwt = require('jsonwebtoken');

exports.postJob = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decodedToken._id;

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const {
      title,
      description,
      budget,
      budgetType,
      requiredSkills,
      expertiseLevel,
      projectScope,
      files
    } = req.body;

    const job = new Job({
      title,
      description,
      budget,
      budgetType,
      requiredSkills,
      expertiseLevel,
      projectScope,
      files,
      postedBy: clientId
    });

    await job.save();

    client.jobPosts.push(job._id);

    await client.save();

    return res.status(200).json({ job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
