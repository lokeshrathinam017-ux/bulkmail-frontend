import { useState, useEffect } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [sentHistory, setSentHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/senthistory`)
      .then((res) => {
        setSentHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlemsg = (event) => {
    setmsg(event.target.value);
  }

  const handlefile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedList = XLSX.utils.sheet_to_json(worksheet, { header: "B" });
      const totalemail = parsedList.map(function(item) { return item.Email; }).filter(Boolean);
      setEmailList(totalemail);
    }

    reader.readAsBinaryString(file);
  }

  const send = () => {
    if (emailList.length === 0) {
      alert("Please upload an Excel file with valid emails.");
      return;
    }
    setstatus(true);
    axios.post(`${API_URL}/sendemail`, { msg: msg, emailList: emailList })
      .then(function(data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          axios.get(`${API_URL}/senthistory`).then((res) => setSentHistory(res.data));
          setstatus(false);
          setShowCompose(false);
          setmsg("");
          setEmailList([]);
        } else {
          alert("Email Not Sent");
          setstatus(false);
        }
      }).catch(() => {
        alert("Failed to send emails");
        setstatus(false);
      });
  }

  return (
    <div className="flex h-screen bg-[#F5F5DC] font-sans overflow-hidden relative">
      
      <div 
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col justify-between p-5 border-r border-teal-100 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#008080] text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-lg">
                M
              </div>
              <h1 className="text-xl font-bold text-[#008080]">MailFlow</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-500 font-bold text-xl">&times;</button>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("inbox")} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'inbox' ? 'bg-[#008080] text-white shadow-md' : 'text-slate-600 hover:bg-teal-50'}`}
            >
              📥 Inbox
            </button>
            <button 
              onClick={() => setActiveTab("sent")} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'sent' ? 'bg-[#008080] text-white shadow-md' : 'text-slate-600 hover:bg-teal-50'}`}
            >
              📤 Sent History
            </button>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <div className="h-16 bg-white border-b border-teal-100 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-700 focus:outline-none flex flex-col gap-1.5 p-2 rounded-lg hover:bg-teal-50 transition"
              aria-label="Toggle Sidebar"
            >
              <span className="w-6 h-0.5 bg-slate-700 block"></span>
              <span className="w-6 h-0.5 bg-slate-700 block"></span>
              <span className="w-6 h-0.5 bg-slate-700 block"></span>
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.name || user.email}</span>
            <div className="w-10 h-10 bg-[#008080] text-white font-bold rounded-full flex items-center justify-center shadow-md">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'inbox' ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-5xl mb-3">📭</span>
              <p className="text-lg font-medium">Your Inbox is empty</p>
              <p className="text-sm text-slate-400 mt-1">No incoming messages to display.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Sent History & Recipients</h3>
              {sentHistory.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-slate-400">
                  <p>No bulk emails sent yet. Click Compose to get started!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {sentHistory.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-teal-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold text-[#008080]">Campaign #{idx + 1}</span>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message Content:</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border">{item.msg}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Recipients ({item.emailList.length}):</p>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-teal-50/50 rounded-lg border border-teal-100">
                          {item.emailList.map((email, eIdx) => (
                            <span key={eIdx} className="bg-white text-slate-700 text-xs px-2.5 py-1 rounded-full border border-teal-200">
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setShowCompose(true)}
        className="fixed bottom-8 right-8 bg-[#008080] text-white px-6 py-4 rounded-full shadow-2xl font-bold text-base flex items-center gap-2 hover:bg-[#006666] transition transform hover:scale-105 z-30"
      >
        <span>✏️</span> Compose
      </button>

      {showCompose && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-[#008080] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">New Bulk Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-white hover:text-teal-200 text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <textarea 
                onChange={handlemsg} 
                value={msg} 
                className="w-full h-36 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080] text-sm" 
                placeholder="Type your message here..."
              ></textarea>

              <div className="border-2 border-dashed border-teal-200 p-4 rounded-xl text-center bg-teal-50/50">
                <input onChange={handlefile} type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#008080] file:text-white hover:file:bg-[#006666] cursor-pointer" />
                <p className="text-xs text-slate-600 mt-2 font-medium">Total Emails in File: {emailList.length}</p>
              </div>

              <button 
                onClick={send} 
                className="bg-[#008080] text-white py-3 rounded-xl font-semibold hover:bg-[#006666] transition w-full shadow-md"
              >
                {status ? "Sending emails..." : "Send Bulk Mail"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;