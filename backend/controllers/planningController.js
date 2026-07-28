// Planning Canvas Controller Placeholders (No AI / Business Logic)

export const createPlanningCanvas = async (req, res) => {
  try {
    const planData = req.body || {};
    return res.status(201).json({
      success: true,
      message: 'Planning Canvas created successfully (Placeholder)',
      data: {
        id: `plan_${Date.now()}`,
        ...planData,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPlanningCanvases = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Fetched all Planning Canvases (Placeholder)',
      data: [
        {
          id: 'plan_placement_prep',
          title: 'Tier-1 Tech Company Placement Preparation',
          category: 'Career',
          status: 'In Progress',
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlanningCanvasById = async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json({
      success: true,
      message: `Fetched Planning Canvas ID: ${id} (Placeholder)`,
      data: {
        id,
        title: 'Sample AI Roadmap',
        status: 'In Progress'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlanningCanvas = async (req, res) => {
  try {
    const updateData = req.body || {};
    return res.status(200).json({
      success: true,
      message: 'Planning Canvas updated (Placeholder)',
      data: updateData
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlanningCanvas = async (req, res) => {
  try {
    const { id } = req.body || {};
    return res.status(200).json({
      success: true,
      message: `Planning Canvas ${id || 'item'} deleted (Placeholder)`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportPlanningCanvas = async (req, res) => {
  try {
    const { format = 'pdf', title } = req.body || {};
    return res.status(200).json({
      success: true,
      format,
      downloadUrl: `/downloads/roadmap_${Date.now()}.${format}`,
      message: `Exported "${title || 'Planning Canvas'}" as ${format.toUpperCase()} (Placeholder)`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createPlanningCanvas,
  getAllPlanningCanvases,
  getPlanningCanvasById,
  updatePlanningCanvas,
  deletePlanningCanvas,
  exportPlanningCanvas
};
