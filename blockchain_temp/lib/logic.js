/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.example.basic.UpdateRecord} tx The sample transaction instance.
 * @transaction
 */
async function sampleTransaction(tx) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    var newString = tx.asset.value.toString() + ',' + tx.newValue.toString();

    //var newSample = new Array(oldValue.toString(),tx.newValue.toString());
    var newSample = newString.split(',');



    // Update the asset with the new value.
    //tx.asset.value = tx.newValue;
      tx.asset.value = newSample;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.MedicalRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'UpdateEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}


/**
 * Sample transaction processor function.
 * @param {org.example.basic.ShareDoctor} sh The sample transaction instance.
 * @transaction
 */
async function sharing(sh) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldDoctorId = sh.asset.doctorId;

    var newString = sh.asset.doctorId.toString() + ',' + sh.newDoctorId.toString();
    var newSample = newString.split(',');

    // Update the asset with the new value.
    // sh.asset.doctorId = sh.newDoctorId;
    sh.asset.doctorId = newSample;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.MedicalRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(sh.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'SharingEvent');
    event.asset = sh.asset;
    event.oldDoctorId = oldDoctorId;
    event.newDoctorId = sh.newDoctorId;
    emit(event);
}





/**
 * Sample transaction processor function.
 * @param {org.example.basic.RemoveDoctor} sh The sample transaction instance.
 * @transaction
 */
async function removing(sh) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldDoctorId = sh.asset.doctorId;

    let newString =  sh.asset.doctorId.toString().split(',');
    console.log(newString);
    newString = newString.filter(item => item !== sh.doctorRemoveId)
    console.log(newString);
    // var newSample = newString.split(',');

    // Update the asset with the new value.
    // sh.asset.doctorId = sh.newDoctorId;
    sh.asset.doctorId = newString;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.MedicalRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(sh.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'RemovingEvent');
    event.asset = sh.asset;
    event.oldDoctorId = oldDoctorId;
    event.removedDoctorId = sh.doctorRemoveId;
    emit(event);
}












/**
 * Sample transaction processor function.
 * @param {org.example.basic.RecordVerification} sh The sample transaction instance.
 * @transaction
 */
async function verification(sh) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldVerified = sh.asset.verified;

    // Update the asset with the new value.
    sh.asset.verified = sh.newVerified;
    // sh.asset.doctorId = newSample;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.MedicalRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(sh.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'VerificationEvent');
    event.asset = sh.asset;
    event.oldVerified = oldVerified;
    event.newVerified = sh.newVerified;
    emit(event);
}





/**
 * Sample transaction processor function.
 * @param {org.example.basic.UpdateDoctor} sh The sample transaction instance.
 * @transaction
 */
async function updating(sh) {  // eslint-disable-line no-unused-vars

    // Save the old value of the asset.
    const oldDoctorId = sh.asset.doctorId;

    // Update the asset with the new value.
    sh.asset.doctorId = sh.newDoctorId;
    // sh.asset.doctorId = newSample;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.MedicalRecord');
    // Update the asset in the asset registry.
    await assetRegistry.update(sh.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.example.basic', 'UpdatingDoctor');
    event.asset = sh.asset;
    event.oldDoctorId = oldDoctorId;
    event.newDoctorId = sh.newDoctorId;
    emit(event);
}
