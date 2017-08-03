import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

// is this page obsolete?

class LoginPage extends Component {
  render() {
    return  <div>
                <a href="/auth/twitter"><h1>login through twitter!</h1></a>
                <a href="/auth/vkontakte"><h1>login through VK!</h1></a>
                <Link to="/">перейти на вторую страницу!</Link>
            </div>
  }
}

export default LoginPage