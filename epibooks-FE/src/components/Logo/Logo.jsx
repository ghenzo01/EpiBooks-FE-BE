import './Logo.css'

const Logo = ({imgForLogo}) => {
    return (
        <img className="logo" src={imgForLogo} alt="logo" />
    )
}

export default Logo