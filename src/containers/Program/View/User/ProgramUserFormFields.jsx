
import UserFormFields from '@/containers/Users/components/FormFields'

const ProgramUserFormFields = ({roles}) => {
    return (
        <div className="program-user-form-fields">
            <UserFormFields roles={roles} />
        </div>
    )
}

export default ProgramUserFormFields