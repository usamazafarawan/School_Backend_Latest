
import ParentAccount from './parents_account.model';
import StudentRecord from '../students/students.model';



export const addPurchase = async (req, res) => {
  try {
    const { parentId, amount, description } = req.body;

    const account = await ParentAccount.findOne({ parentId });

    account.totalDebit += amount;
    account.balance = account.totalDebit - account.totalCredit;

    account.transactions.push({
      type: "DEBIT",
      amount,
      description: description || "Purchased Item"
    });

    await account.save();

    res.status(200).json({ message: "Purchase added", account });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { parentId, amount, description, type } = req.body;

    const account = await ParentAccount.findOne({ parentId });

    account.totalCredit += amount;
    account.balance = account.totalDebit - account.totalCredit;

    account.transactions.push({
      type: type || "CREDIT",
      amount,
      description: description || "Payment Received"
    });

    await account.save();

    res.status(200).json({ message: "Payment added", account });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getParentAccountDetails = async (req, res) => {
  try {
    const parentId = req.params.parentId;

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    // Fetch account
    const account = await ParentAccount.findOne({ parentId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Fetch parent + children info
    const record = await StudentRecord.findById(parentId);

    return res.status(200).json({
      message: "Parent account fetched successfully",
      parent: record.parent,
      students: record.students,
      account: account
    });

  } catch (error) {
    console.error("Error fetching parent account:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTransactionRecord = async (req, res) => {
  try {
    const { _id, amount, description, type } = req.body;
    console.log('type: ', type);
    console.log('description: ', description);
    console.log('amount: ', amount);
    console.log('_id: ', _id);

    if (!_id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // // Fetch account
    // const account = await ParentAccount.findOne({ parentId });

    // if (!account) {
    //   return res.status(404).json({ message: "Account not found" });
    // }

    // // Fetch parent + children info
    // const record = await StudentRecord.findById(parentId);

    return res.status(200).json({
      message: "Transaction updated successfully",
      // parent: record.parent,
      // students: record.students,
      // account: account
    });

  } catch (error) {
    console.error("Error in Updating Transaction:", error);
    res.status(500).json({ message: error.message });
  }
};

