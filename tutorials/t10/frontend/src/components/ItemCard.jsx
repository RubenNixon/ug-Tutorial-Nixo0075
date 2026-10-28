import { useState } from 'react';

function ItemCard({ item, token, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);
    const [editDesc, setEditDesc] = useState(item.description);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSave = async () => {
        setIsUpdating(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName, description: editDesc })
            });

            // Pessimistic update: only change the UI after the server confirms success
            if (response.ok) {
                const updatedItem = await response.json();
                onUpdate(updatedItem);
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setEditName(item.name);
        setEditDesc(item.description);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="item-card edit-mode">
                <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                />
                <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                />
                <div>
                    <button onClick={handleSave} disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="item-card">
            <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0fbcf9' }}>{item.name}</h3>
                <p style={{ margin: 0, opacity: 0.8 }}>{item.description}</p>
            </div>
            <div>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(item._id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ItemCard;
