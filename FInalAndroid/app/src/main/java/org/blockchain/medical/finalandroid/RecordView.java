package org.blockchain.medical.finalandroid;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import java.nio.charset.StandardCharsets;
import java.security.DigestException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;


import com.scottyab.aescrypt.AESCrypt;

import java.lang.reflect.Array;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import pl.droidsonroids.gif.GifImageView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static java.nio.charset.StandardCharsets.UTF_8;

public class RecordView extends AppCompatActivity {

    String hash;
    TextView record;
    byte[] decryptedString;
    String contentkey;
    GifImageView gif;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_record_view);

        record= findViewById(R.id.record);
        gif = findViewById(R.id.gif);

        viewRecord();
    }

    void viewRecord(){

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);

        Bundle bundle = getIntent().getExtras();
        hash = bundle.getString("value");



        SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);
        contentkey = pref.getString("contentkey","2001");
        Log.d("contentxxx",contentkey);

        Log.d("hashiii",hash);

        Call<List<ViewResponse>> call = api.viewRecord(hash);

        call.enqueue(new Callback<List<ViewResponse>>() {
            @Override
            public void onResponse(Call<List<ViewResponse>> call, Response<List<ViewResponse>> response) {

                List<ViewResponse> docs = response.body();
                Log.d("encryptxxx",docs.get(0).status);



                byte[] cipherData = Base64.getDecoder().decode(docs.get(0).status);
                byte[] saltData = Arrays.copyOfRange(cipherData, 8, 16);

                MessageDigest md5 = null;
                try {
                    md5 = MessageDigest.getInstance("MD5");
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                }
                final byte[][] keyAndIV = GenerateKeyAndIV(32, 16, 1, saltData, contentkey.getBytes(StandardCharsets.UTF_8), md5);
                SecretKeySpec key = new SecretKeySpec(keyAndIV[0], "AES");
                IvParameterSpec iv = new IvParameterSpec(keyAndIV[1]);

                byte[] encrypted = Arrays.copyOfRange(cipherData, 16, cipherData.length);
                Cipher aesCBC = null;
                try {
                    aesCBC = Cipher.getInstance("AES/CBC/PKCS5Padding");
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                } catch (NoSuchPaddingException e) {
                    e.printStackTrace();
                }
                try {
                    aesCBC.init(Cipher.DECRYPT_MODE, key, iv);
                } catch (InvalidAlgorithmParameterException e) {
                    e.printStackTrace();
                } catch (InvalidKeyException e) {
                    e.printStackTrace();
                }
                byte[] decryptedData = new byte[0];
                try {
                    decryptedData = aesCBC.doFinal(encrypted);
                } catch (BadPaddingException e) {
                    e.printStackTrace();
                } catch (IllegalBlockSizeException e) {
                    e.printStackTrace();
                }
                String decryptedText = new String(decryptedData, StandardCharsets.UTF_8);


                gif.setVisibility(View.INVISIBLE);
                record.setText(decryptedText);
                record.setVisibility(View.VISIBLE);




            }

            @Override
            public void onFailure(Call<List<ViewResponse>> call, Throwable t) {

                Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });



    }


    public static byte[][] GenerateKeyAndIV(int keyLength, int ivLength, int iterations, byte[] salt, byte[] password, MessageDigest md) {

        int digestLength = md.getDigestLength();
        int requiredLength = (keyLength + ivLength + digestLength - 1) / digestLength * digestLength;
        byte[] generatedData = new byte[requiredLength];
        int generatedLength = 0;

        try {
            md.reset();

            // Repeat process until sufficient data has been generated
            while (generatedLength < keyLength + ivLength) {

                // Digest data (last digest if available, password data, salt if available)
                if (generatedLength > 0)
                    md.update(generatedData, generatedLength - digestLength, digestLength);
                md.update(password);
                if (salt != null)
                    md.update(salt, 0, 8);
                md.digest(generatedData, generatedLength, digestLength);

                // additional rounds
                for (int i = 1; i < iterations; i++) {
                    md.update(generatedData, generatedLength, digestLength);
                    md.digest(generatedData, generatedLength, digestLength);
                }

                generatedLength += digestLength;
            }

            // Copy key and IV into separate byte arrays
            byte[][] result = new byte[2][];
            result[0] = Arrays.copyOfRange(generatedData, 0, keyLength);
            if (ivLength > 0)
                result[1] = Arrays.copyOfRange(generatedData, keyLength, keyLength + ivLength);

            return result;

        } catch (DigestException e) {
            throw new RuntimeException(e);

        } finally {
            // Clean out temporary data
            Arrays.fill(generatedData, (byte)0);
        }
    }

}
