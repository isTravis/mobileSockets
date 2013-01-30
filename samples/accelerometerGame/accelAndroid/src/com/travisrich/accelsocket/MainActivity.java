package com.travisrich.accelsocket;

import java.net.URI;
import java.util.Random;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Menu;

public class MainActivity extends Activity implements SensorEventListener {
	
	private float[] gravity = {0,0,0};
	private float[] linear_acceleration = {0,0,0};
	private SensorManager mSensorManager;
	private Sensor accSensor;
	private float alpha = 0.8f;
	private int sessionID;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
		accSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		Random r = new Random();
		sessionID=r.nextInt(1000) + 1;
		
		
		
	}
	
	protected void onResume() {
		super.onResume();
		mSensorManager.registerListener(this, accSensor,SensorManager.SENSOR_DELAY_UI);
	}

	protected void onPause() {
		super.onPause();
		mSensorManager.unregisterListener(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {	
	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER){
//			gravity = event.values;
//			System.out.print("Gravity Vals:");
//			System.out.println(gravity);
			
//			System.out.println("updating sensor values");

			// Isolate the force of gravity with the low-pass filter.
			gravity[0] = alpha * gravity[0] + (1 - alpha) * event.values[0];
			gravity[1] = alpha * gravity[1] + (1 - alpha) * event.values[1];
			gravity[2] = alpha * gravity[2] + (1 - alpha) * event.values[2];

			// Remove the gravity contribution with the high-pass filter.
			linear_acceleration[0] = event.values[0] - gravity[0]; //x
			linear_acceleration[1] = event.values[1] - gravity[1]; //y
			linear_acceleration[2] = event.values[2] - gravity[2]; //z
			
//			System.out.println("Gravity Val 0:"+ gravity[0]);
//			System.out.println("Gravity Val 1:"+ gravity[1]);
//			System.out.println("Gravity Val 2:"+ gravity[2]);
//			System.out.println("Linear Val 0:"+ linear_acceleration[0]);
//			System.out.println("Linear Val 1:"+ linear_acceleration[1]);
//			System.out.println("Linear Val 2:"+ linear_acceleration[2]);
//			System.out.println("----------");

			sendData(); //start sendData thread
		}
	}
	
	private void sendData() {
		new Thread(new Runnable() { 
			@Override
			public void run() {
//				System.out.println("In run of senddata");
				if(linear_acceleration[2]> 10){
					System.out.println("Jump");
					try{
						HttpClient httpClient = new DefaultHttpClient();
			            HttpGet httpGet = new HttpGet();
//			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+linear_acceleration[2]);
			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+sessionID+"&message=jump");
			            httpGet.setURI(uri);
			            httpClient.execute(httpGet);
//			            System.out.println("Http sorta worked");
					} catch (Exception e) {
						System.out.println(e);
					}
				}
				
				//Left
				if(linear_acceleration[0]> 12){
					System.out.println("Left");
					try{
						HttpClient httpClient = new DefaultHttpClient();
			            HttpGet httpGet = new HttpGet();
//			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+linear_acceleration[2]);
			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+sessionID+"&message=left");
			            httpGet.setURI(uri);
			            httpClient.execute(httpGet);
//			            System.out.println("Http sorta worked");
					} catch (Exception e) {
						System.out.println(e);
					}
				}
				
				//Right
				if(linear_acceleration[0]< -12){
					System.out.println("Right");
					try{
						HttpClient httpClient = new DefaultHttpClient();
			            HttpGet httpGet = new HttpGet();
//			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+linear_acceleration[2]);
			            URI uri = new URI("http://trex.media.mit.edu:7701/add/?id="+sessionID+"&message=right");
			            httpGet.setURI(uri);
			            httpClient.execute(httpGet);
//			            System.out.println("Http sorta worked");
					} catch (Exception e) {
						System.out.println(e);
					}
				}
			}
		}).start();
	}

	
}
