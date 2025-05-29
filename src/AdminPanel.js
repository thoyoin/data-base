import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetch('https://db-backend-0p5f.onrender.com/api/users', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Failed to load users', err));
    }, []);

    const handleSelect = (id) => {
        const newSet = new Set(selected);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelected(newSet);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelected(new Set());
        } else {
            setSelected(new Set(users.map(u => u.id)));
        }
        setSelectAll(!selectAll);
    };

    const performAction = async (action) => {
        if (selected.size === 0) return;
        const ids = Array.from(selected);
        await fetch(`https://db-backend-0p5f.onrender.com/api/users/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ids })
        });
        const res = await fetch('https://db-backend-0p5f.onrender.com/api/users', { credentials: 'include' });
        const updated = await res.json();
        setUsers(updated);
        setSelected(new Set());
        setSelectAll(false);
    };

    const formatRelativeTime = (dateStr) => {
        const now = new Date();
        const past = new Date(dateStr);
        const diff = Math.floor((now - past) / 1000);
    
        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
        return past.toLocaleDateString();
    };

    const nav = useNavigate();
    const toLogin = () => {
        nav('/Login');
    }

    return (

        <div className='text-bg-light'>
            <div className="container min-vh-100 position-relative d-flex flex-column justify-content-center align-items-center">
                <button type="button" class="btn btn-outline-dark mb-5" onClick={toLogin}>Leave</button>
                <div id='border' className='container d-flex flex-column justify-content-center align-items-center border border-2 rounded-4 p-5' style={{maxWidth:'1000px' , height:'500px'}}>
                    <div id='dashboard' className="d-flex align-items-center w-100 h-100 my-3 bg-light rounded-4 border border-2" style={{maxHeight: '60px' , maxWidth:'800px'}}>
                        <button type="button" className="btn btn-outline-dark py-2 mx-2" onClick={() => performAction('block')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-lock-fill me-2" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                            </svg>
                        Block
                        </button>
                        <button type="button" className="btn btn-outline-dark py-2 me-2" onClick={() => performAction('unblock')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-unlock-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M12 0a4 4 0 0 1 4 4v2.5h-1V4a3 3 0 1 0-6 0v2h.5A2.5 2.5 0 0 1 12 8.5v5A2.5 2.5 0 0 1 9.5 16h-7A2.5 2.5 0 0 1 0 13.5v-5A2.5 2.5 0 0 1 2.5 6H8V4a4 4 0 0 1 4-4"/>
                            </svg>
                        </button>
                        <button type="button" className="btn btn-outline-danger py-2" onClick={() => performAction('delete')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                            </svg>
                        </button>
                        <input id='filter' className="form-control float-end mx-2 ms-auto" style={{maxWidth: '230px'}} type="text" placeholder="Filter" aria-label="default input example"></input>
                    </div>
                    <table id='table' className="table table-light h-100 align-middle" style={{maxWidth:'800px' , maxHeight:'300px'}}>
                    <thead>
                            <tr>
                                <th scope="col"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th className='lastSeen' scope="col">Last seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <th scope="row">
                                        <input type="checkbox" checked={selected.has(user.id)} onChange={() => handleSelect(user.id)} />
                                    </th>
                                    <td className={user.is_blocked ? 'text-black-50 text-decoration-line-through' : ''}>{user.name}</td>
                                    <td className={user.is_blocked ? 'text-black-50' : ''}>{user.email}</td>
                                    <td className={user.is_blocked ? 'text-black-50 lastSeen' : 'lastSeen'} title={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}>
                                        {user.last_login ? formatRelativeTime(user.last_login) : 'Never'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
  )
};

export default AdminPanel;