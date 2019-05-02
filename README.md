# MediDocs

## Web App Flow
### Regulator Login
- [x] Regulator will be already setup in blockchain
- [x] Login as regulator using regulator id and passowrd
- [x] List hospitals and doctor in web portal
- [x] Add new hospital - api not tested
- [] Add new doctor - async error, charcater count error in api
- [ ] Ban doctor
- [ ] Ban hospital


### Hospital Login
- [x] Hospital will be added by the regulator
- [x] Login using hospital id and password
- [x] Option to add doctos
- [x] List all doctors in hospital -- query created not tested, added new field to doctor
- [x] Ban doctor

### Doctor Login
- [x] Will be added by hopital or regulator
- [x] Create medical record - get data as parameter, aes encryption, add to ipfs, get content hash, add to blockchain after calculating record id
- [x] Sending notification to patient when new record is created
 
