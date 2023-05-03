import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { SignOut } from '../components/SignOut';
import { GoogleSignIn } from '../components/GoogleSignIn';
import { Stylesheet } from '../components/Stylesheet';
import { SignIn } from '../components/SignIn';
import Navbar from '../Navbar';
import App from '../App';

//Testing each simple, static component renders
test("Render Signout", () => {
    render(<SignOut />);

    const element = screen.getByText(/Sign Out/i);

    expect(element).toBeInTheDocument();
})

test("Render Google Sign In", () => {
    render(<GoogleSignIn />);

    const element = screen.getByText(/Sign in with */i);

    expect(element).toBeInTheDocument();
})

test("Render Stylesheet", () => {
    render(<Stylesheet />);

    const element = screen.getByText(/Welcome*/i);

    expect(element).toBeInTheDocument();
})

test("Render Sign in And Create Account", () => {
    render(<SignIn />);

    //finding create account portion
    const element = screen.getAllByText('Create Account');

    expect(element[0]).toBeInTheDocument();
})


test("Render Navbar", () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    const element = screen.getByText(/Chore No More/i);

    expect(element).toBeInTheDocument();
})

test("Render Loading App", () => {
    render(<App />);

    const element = screen.getByText(/Loading/i);

    expect(element).toBeInTheDocument();
})