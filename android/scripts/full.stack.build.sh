#!/usr/bin/env bash

# CHANGE FOLLOWING
VAGRANT_HOME=/home/vagrant
INDY_VAGRANT_WORKDIR=Work/repos/faisal00813/indy-sdk  #Make sure you have indy dir path according to vagrant 
INDY_WORKDIR=~/Work/repos/faisal00813/indy-sdk 
VCX_WORKDIR=~/Work/repos/evernym/sdk
CONNECTME_WORKDIR=~/Work/repos/evernym/ConnectMe


download_and_unzip_deps(){
	rm -rf indy-android-dependencies
	git clone https://github.com/faisal00813/indy-android-dependencies.git
	pushd indy-android-dependencies/prebuilt/ && find . -name "*.zip" | xargs -P 5 -I FILENAME sh -c 'unzip -o -d "$(dirname "FILENAME")" "FILENAME"'
	popd
	mv indy-android-dependencies/prebuilt dependencies
}


generate_flags(){
	if [ -z $1 ]; then
		echo "please provide the arch e.g arm, x86 or arm64"
	fi
	if [ $1 == "arm" ]; then
		export ARCH="arm" 
		export TRIPLET="arm-linux-androideabi"
		export PLATFORM="16"
		export ABI="armeabi-v7a"
	fi

	if [ $1 == "x86" ]; then
		export ARCH="x86"
		export TRIPLET="i686-linux-android"
		export PLATFORM="16"
		export ABI="x86"
	fi

	if [ $1 == "arm64" ]; then
		export ARCH="arm64"
		export TRIPLET="aarch64-linux-android"
		export PLATFORM="21"
		export ABI="arm64-v8a"
	fi
}

build_indy(){
	generate_flags $1
	download_and_unzip_deps
	pushd ~/Work/vagrant
	CMD="pushd ${INDY_VAGRANT_WORKDIR}/libindy/build_scripts/android &&./build.nondocker.sh ${ARCH} ${PLATFORM} ${TRIPLET} dependencies/openssl/openssl_${ARCH} dependencies/sodium/libsodium_${ARCH} dependencies/zmq/libzmq_${ARCH}"
	vagrant ssh -c "${CMD}"
	popd

}

build_libnullpay(){
	generate_flags $1
	download_and_unzip_deps
	pushd ~/Work/vagrant
	CMD="pushd ${INDY_VAGRANT_WORKDIR}/libnullpay/build_scripts/android && cp -rf ${VAGRANT_HOME}/${INDY_VAGRANT_WORKDIR}/libindy/build_scripts/android/libindy_${ARCH} . && ./build.nondocker.sh ${ARCH} ${PLATFORM} ${TRIPLET} ${VAGRANT_HOME}/${INDY_VAGRANT_WORKDIR}/libindy/build_scripts/android/libindy_${ARCH}"
	vagrant ssh -c "${CMD}"
	popd

}


build_vcx(){
	generate_flags $1
	pushd ${VCX_WORKDIR}/vcx/libvcx/build_scripts/android/vcx
		cp -rf ${INDY_WORKDIR}/libindy/build_scripts/android/libindy_${ARCH} .
		cp -rf ${INDY_WORKDIR}/libnullpay/build_scripts/android/libnullpay_${ARCH} .
		download_and_unzip_deps
		./build.nondocker.sh ${ARCH} ${PLATFORM} ${TRIPLET} dependencies/openssl/openssl_${ARCH} dependencies/sodium/libsodium_${ARCH} dependencies/zmq/libzmq_${ARCH} libindy_${ARCH} libnullpay_${ARCH}
	popd
}

build_wrapper(){
	mkdir -p ${VCX_WORKDIR}/vcx/wrappers/java/vcx/src/main/jniLibs/arm
	mkdir -p ${VCX_WORKDIR}/vcx/wrappers/java/vcx/src/main/jniLibs/x86
	cp -v ${VCX_WORKDIR}/vcx/libvcx/build_scripts/android/vcx/libvcx_arm/libvcx.so ${VCX_WORKDIR}/vcx/wrappers/java/vcx/src/main/jniLibs/armeabi-v7a
	cp -v ${VCX_WORKDIR}/vcx/libvcx/build_scripts/android/vcx/libvcx_x86/libvcx.so ${VCX_WORKDIR}/vcx/wrappers/java/vcx/src/main/jniLibs/x86
	pushd ${VCX_WORKDIR}/vcx/wrappers/java/vcx
		../gradlew clean assemble
	popd
}

copy_wrapper(){
	cp -v ${VCX_WORKDIR}/vcx/wrappers/java/vcx/build/outputs/aar/vcx-release.aar ${CONNECTME_WORKDIR}/android/app/libs
}

build_wrapper_and_update_gradle_files(){
	AAR=$(build_wrapper | perl -nle 'print $& if m{(?<=vcx-1.0.0-)(.*)(?=.aar)}' | head -1 | awk '{print $1}' )
	echo ${AAR}
	REPLACE=$(cat ${CONNECTME_WORKDIR}/android/app/build.gradle | perl -nle "print $& if m{(?<=vcx:1.0.0-)(.*)(?=')}")
	echo " ${REPLACE} will be replaced with :: ${AAR} in build.gradle"
	sleep 10
	pushd ${CONNECTME_WORKDIR}/android/app/
		sed -i '.original' "s/${REPLACE}/${AAR}/g" build.gradle
		rm build.gradle.original
	popd
}

uninstall_app(){
		adb uninstall com.connectme
		sleep 10
}
delete_existing_wallet(){
	adb shell rm -rf /sdcard/.indy_client
}
run_app(){
	#Run Connect.me in emulator
	pushd ${CONNECTME_WORKDIR}
		react-native bundle --platform android --dev true --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
		pushd android
			../gradlew clean installDebug --stacktrace && \
			adb -s emulator-5554 reverse tcp:8081 tcp:8081 && \
			adb shell pm grant com.connectme android.permission.SYSTEM_ALERT_WINDOW && \
			adb shell pm grant com.connectme android.permission.WRITE_EXTERNAL_STORAGE && \
			adb shell pm grant com.connectme android.permission.READ_EXTERNAL_STORAGE && \
			adb -s emulator-5554 shell am start -n com.connectme/com.connectme.MainActivity


		popd 
	popd
}


### Build binaries
# build_indy arm
# build_indy arm64
# build_indy x86
# build_libnullpay arm
# build_libnullpay arm64
# build_libnullpay x86
# build_vcx arm
# build_vcx arm64
# build_vcx x86

### Build Wrappers
# build_wrapper_and_update_gradle_files
build_wrapper
copy_wrapper

### Run app
uninstall_app
delete_existing_wallet
run_app
