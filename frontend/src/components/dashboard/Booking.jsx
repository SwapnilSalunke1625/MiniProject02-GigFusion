import React, { useState } from 'react';

const Booking = () => {
    const [workerType, setWorkerType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    const handleBooking = (e) => {
        e.preventDefault();
        // Add your booking logic here (e.g., send data to backend)
        console.log({
            workerType,
            date,
            time,
            additionalInfo,
        });
        alert("Booking submitted successfully!");
        // Clear form fields
        setWorkerType('');
        setDate('');
        setTime('');
        setAdditionalInfo('');
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h2>Book a Worker</h2>
            <form onSubmit={handleBooking}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Worker Type:</label>
                    <select
                        value={workerType}
                        onChange={(e) => setWorkerType(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="">Select Worker Type</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Carpenter">Carpenter</option>
                        <option value="Painter">Painter</option>
                        {/* Add more worker types as needed */}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Time:</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Additional Information:</label>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Provide any additional details here..."
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'orange', border: 'none', color: '#fff' }}>
                    Submit Booking
                </button>
            </form>
        </div>
    );
};

export default Booking;
