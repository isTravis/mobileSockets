package com.travisrich.soundsocket;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.text.format.Time;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

public class MainActivity extends Activity {

	public static final int SAMPLE_RATE = 8000;

	private AudioRecord mRecorder;
	private File mRecording;
	private short[] mBuffer;
	private final String startRecordingLabel = "Start recording";
	private final String stopRecordingLabel = "Stop recording";
	private boolean mIsRecording = false;
	private ProgressBar mProgressBar;
    


	@Override
	public void onCreate(final Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		initRecorder();

		mProgressBar = (ProgressBar) findViewById(R.id.progressBar);

		final Button button = (Button) findViewById(R.id.button);
		button.setText(startRecordingLabel);

		button.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(final View v) {
				if (!mIsRecording) {
					button.setText(stopRecordingLabel);
					mIsRecording = true;
					mRecorder.startRecording();
					mRecording = getFile("raw");
					startBufferedWrite(mRecording);
				}
				else {
					button.setText(startRecordingLabel);
					mIsRecording = false;
					mRecorder.stop();
//					File waveFile = getFile("wav");
//					try {
//						rawToWave(mRecording, waveFile);
//					} catch (IOException e) {
//						Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
//					}
//					Toast.makeText(MainActivity.this, "Recorded to " + waveFile.getName(),
//							Toast.LENGTH_SHORT).show();
				}
			}
		});
	}

	@Override
	public void onDestroy() {
		mRecorder.release();
		super.onDestroy();
	}

	private void initRecorder() {
		int bufferSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
				AudioFormat.ENCODING_PCM_16BIT);
		mBuffer = new short[bufferSize];
		mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
				AudioFormat.ENCODING_PCM_16BIT, bufferSize);
	}

	private void startBufferedWrite(final File file) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				DataOutputStream output = null;
				try {
					output = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(file)));
					while (mIsRecording) {
						double sum = 0;
						int readSize = mRecorder.read(mBuffer, 0, mBuffer.length);
						for (int i = 0; i < readSize; i++) {
							output.writeShort(mBuffer[i]);
							sum += mBuffer[i] * mBuffer[i];
						}
						if (readSize > 0) {
							final double amplitude = sum / readSize;
							
							//Here is where we try to write to the server
							///////////////////		
							try{
							HttpClient httpClient = new DefaultHttpClient();
				            HttpGet httpGet = new HttpGet();
				            URI uri = new URI("http://trex.media.mit.edu:5501/add/?id="+amplitude);
				            httpGet.setURI(uri);
				            httpClient.execute(httpGet);
//				            System.out.println("Http sorta worked");
							} catch (Exception e) {
								System.out.println(e);
							}
							///////////////////
							
							mProgressBar.setProgress((int) Math.sqrt(amplitude));
						}
					}
				} catch (IOException e) {
					Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
				} finally {
					mProgressBar.setProgress(0);
					if (output != null) {
						try {
							output.flush();
						} catch (IOException e) {
							Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT)
									.show();
						} finally {
							try {
								output.close();
							} catch (IOException e) {
								Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT)
										.show();
							}
						}
					}
				}
			}
		}).start();
	}


	private File getFile(final String suffix) {
		Time time = new Time();
		time.setToNow();
		return new File(Environment.getExternalStorageDirectory(), time.format("%Y%m%d%H%M%S") + "." + suffix);
	}

}