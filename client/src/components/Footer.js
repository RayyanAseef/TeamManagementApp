import Dashboard from '../pages/Dashboard';

const Footer = () => {
    return (
      <footer className="site-footer">
        <div className="container">
          <div className="footer-section" id="about">
            <h6>About</h6>
            <p>Team Management App is a team management platform that helps streamline tasks, requests, and communication between employees and managers. Whether you're tracking your tasks or managing a team, we provide the tools to keep everyone connected and organized.</p>
          </div>
          <div className="footer-section">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li><a href="/dashboard?id=0">Tasks</a></li>
              <li><a href="/dashboard?id=1">Requests</a></li>
              <li><a href="/dashboard?id=2">Meetings</a></li>
              <li><a href="/dashboard?id=4">Messages</a></li>
              <li><a href="/dashboard?id=3">Workers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Contribute</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  