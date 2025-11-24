
import schoolExpenses from './expenses.model';



export const addExpense = async (req, res) => {
  try {
    const { amount, description, paidBy } = req.body;

    const expense = await schoolExpenses.create({
      amount,
      description,
      paidBy
    });

    res.status(200).json({ message: "Expense added", expense });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Convert to real date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Include full day of endDate
    end.setHours(23, 59, 59, 999);

    const expenses = await schoolExpenses.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({ expenses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await schoolExpenses.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};